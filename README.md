--------------------------------------------------
-- 1. Enable the pgcrypto extension (required for gen_random_uuid())
--------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------
-- 2. Create the User Registration Table (User Profile)
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_accounts (
  user_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  full_name           VARCHAR(255) NOT NULL,      
  email               VARCHAR(255) NOT NULL UNIQUE, 
  phone_number        VARCHAR(50)  NOT NULL,      
  date_of_birth       DATE         NOT NULL,      
  residential_address TEXT         NOT NULL,      
  account_type        VARCHAR(50)  NOT NULL,      
  username            VARCHAR(50)  NOT NULL UNIQUE, 
  password_hash       TEXT         NOT NULL,      
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()  
);

--------------------------------------------------
-- 3. Create the Bank Accounts Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  account_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  user_id      UUID NOT NULL,                             
  account_type VARCHAR(50)  NOT NULL,                             
  balance      NUMERIC(15,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),  
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),               
  FOREIGN KEY (user_id) REFERENCES public.user_accounts(user_id) ON DELETE CASCADE
);

--------------------------------------------------
-- 4. Create the Transactions Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  transaction_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  account_id            UUID NOT NULL,                             
  transaction_type      VARCHAR(50)  NOT NULL,                             
  amount                NUMERIC(15,2) NOT NULL CHECK (amount > 0),        
  transaction_timestamp TIMESTAMPTZ  NOT NULL DEFAULT NOW(),               
  description           TEXT,                                                 
  FOREIGN KEY (account_id) REFERENCES public.bank_accounts(account_id) ON DELETE CASCADE
);

--------------------------------------------------
-- 5. Create the Loans Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loans (
  loan_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  user_id       UUID NOT NULL,                             
  loan_amount   NUMERIC(15,2) NOT NULL CHECK (loan_amount > 0),       
  interest_rate NUMERIC(5,2)  NOT NULL CHECK (interest_rate >= 0),     
  status        VARCHAR(20)  NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),  
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),               
  FOREIGN KEY (user_id) REFERENCES public.user_accounts(user_id) ON DELETE CASCADE
);

--------------------------------------------------
-- 6. Create the Transfers Table (for Inter-Account Fund Transfers)
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transfers (
  transfer_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  from_account       UUID NOT NULL,                             
  to_account         UUID NOT NULL,                             
  amount             NUMERIC(15,2) NOT NULL CHECK (amount > 0),        
  transfer_timestamp TIMESTAMPTZ  NOT NULL DEFAULT NOW(),               
  description        TEXT,                                                 
  FOREIGN KEY (from_account) REFERENCES public.bank_accounts(account_id) ON DELETE CASCADE,
  FOREIGN KEY (to_account) REFERENCES public.bank_accounts(account_id) ON DELETE CASCADE
);

--------------------------------------------------
-- 7. Create the Expenditures Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expenditures (
  expenditure_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  account_id            UUID NOT NULL,                             
  category              VARCHAR(50)  NOT NULL,                             
  amount                NUMERIC(15,2) NOT NULL CHECK (amount > 0),        
  expenditure_timestamp TIMESTAMPTZ  NOT NULL DEFAULT NOW(),               
  description           TEXT,                                                 
  FOREIGN KEY (account_id) REFERENCES public.bank_accounts(account_id) ON DELETE CASCADE
);

--------------------------------------------------
-- 8. Create the Investments Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.investments (
  investment_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  user_id         UUID NOT NULL,                             
  account_id      UUID NOT NULL,                             
  asset_type      VARCHAR(50)  NOT NULL,                             
  asset_name      VARCHAR(255) NOT NULL,                             
  quantity        NUMERIC(15,2) NOT NULL CHECK (quantity > 0),       
  purchase_price  NUMERIC(15,2) NOT NULL CHECK (purchase_price > 0),  
  current_price   NUMERIC(15,2) NOT NULL DEFAULT 0.00,               
  purchase_date   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),               
  status          VARCHAR(20)  NOT NULL CHECK (status IN ('active', 'sold')),  
  last_updated    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),               
  FOREIGN KEY (user_id) REFERENCES public.user_accounts(user_id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES public.bank_accounts(account_id) ON DELETE CASCADE
);

--------------------------------------------------
-- 9. Create the Analytics Table
--------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics (
  analytics_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  user_id          UUID NOT NULL,                             
  total_balance    NUMERIC(15,2) NOT NULL DEFAULT 0.00,      
  total_expenditure NUMERIC(15,2) NOT NULL DEFAULT 0.00,      
  total_loans      NUMERIC(15,2) NOT NULL DEFAULT 0.00,      
  total_investments NUMERIC(15,2) NOT NULL DEFAULT 0.00,      
  last_updated     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),       
  FOREIGN KEY (user_id) REFERENCES public.user_accounts(user_id) ON DELETE CASCADE
);

--------------------------------------------------
-- 10. Create Indexes for Performance Optimization
--------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON public.user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_loans_user ON public.loans(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_account ON public.transfers(from_account);
CREATE INDEX IF NOT EXISTS idx_transfers_to_account ON public.transfers(to_account);
CREATE INDEX IF NOT EXISTS idx_expenditures_account ON public.expenditures(account_id);
CREATE INDEX IF NOT EXISTS idx_investments_user ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_asset ON public.investments(asset_name);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON public.analytics(user_id);
CREATE OR REPLACE FUNCTION create_bank_account_and_analytics()
RETURNS TRIGGER AS $$
DECLARE
  new_account_id UUID;
BEGIN
  -- Create a bank account with an initial balance of 0
  INSERT INTO public.bank_accounts (user_id, account_type, balance, created_at)
  VALUES (NEW.user_id, 'savings', 0.00, NOW())
  RETURNING account_id INTO new_account_id;

  -- Create an analytics record with initial values
  INSERT INTO public.analytics (user_id, total_balance, total_expenditure, total_loans, total_investments, last_updated)
  VALUES (NEW.user_id, 0.00, 0.00, 0.00, 0.00, NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_create_account_and_analytics
AFTER INSERT ON public.user_accounts
FOR EACH ROW EXECUTE FUNCTION create_bank_account_and_analytics();
CREATE OR REPLACE FUNCTION update_analytics_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total balance and expenditure
  UPDATE public.analytics
  SET 
    total_balance = (SELECT SUM(balance) FROM public.bank_accounts WHERE user_id = (SELECT user_id FROM public.bank_accounts WHERE account_id = NEW.account_id)),
    total_expenditure = total_expenditure + CASE WHEN NEW.transaction_type = 'debit' THEN NEW.amount ELSE 0 END,
    last_updated = NOW()
  WHERE user_id = (SELECT user_id FROM public.bank_accounts WHERE account_id = NEW.account_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_update_analytics_on_transaction
AFTER INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION update_analytics_on_transaction();
CREATE OR REPLACE FUNCTION update_analytics_on_investment()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total investments
  UPDATE public.analytics
  SET 
    total_investments = total_investments + (NEW.quantity * NEW.purchase_price),
    last_updated = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_update_analytics_on_investment
AFTER INSERT ON public.investments
FOR EACH ROW EXECUTE FUNCTION update_analytics_on_investment();
CREATE OR REPLACE FUNCTION update_analytics_on_loan()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total loans
  UPDATE public.analytics
  SET 
    total_loans = total_loans + NEW.loan_amount,
    last_updated = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_update_analytics_on_loan
AFTER INSERT ON public.loans
FOR EACH ROW EXECUTE FUNCTION update_analytics_on_loan();
CREATE OR REPLACE FUNCTION update_balance_on_transfer()
RETURNS TRIGGER AS $$
BEGIN
  -- Deduct from sender
  UPDATE public.bank_accounts
  SET balance = balance - NEW.amount
  WHERE account_id = NEW.from_account;

  -- Add to receiver
  UPDATE public.bank_accounts
  SET balance = balance + NEW.amount
  WHERE account_id = NEW.to_account;

  -- Update analytics for both users
  UPDATE public.analytics
  SET total_balance = (SELECT SUM(balance) FROM public.bank_accounts WHERE user_id = (SELECT user_id FROM public.bank_accounts WHERE account_id = NEW.from_account)),
      last_updated = NOW()
  WHERE user_id = (SELECT user_id FROM public.bank_accounts WHERE account_id = NEW.from_account);

  UPDATE public.analytics
  SET total_balance = (SELECT SUM(balance) FROM public.bank_accounts WHERE user_id = (SELECT user_id FROM public.bank_accounts WHERE account_id = NEW.to_account)),
      last_updated = NOW()
  WHERE user_id = (SELECT user_id FROM public.bank_accounts WHERE account_id = NEW.to_account);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_update_balance_on_transfer
AFTER INSERT ON public.transfers
FOR EACH ROW EXECUTE FUNCTION update_balance_on_transfer();
INSERT INTO public.bank_accounts (user_id, account_type)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'savings')
RETURNING account_id;
INSERT INTO public.user_accounts (full_name, email, phone_number, date_of_birth, residential_address, account_type, username, password_hash)
VALUES ('John Doe', 'Accountant', '08012345678', '1990-01-01', '123, ABC Street, XYZ City', 'admin', 'admin', 'admin')
RETURNING user_id;