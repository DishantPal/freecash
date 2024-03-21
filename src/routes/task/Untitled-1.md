```
payment_type
---
id

code str
name str
image str

account_input_type str
account_input_label str
account_input_hint str

payment_inputs json ([{key: '', name: '' str, label: '' str, type: '', options: '', placeholder: '', required: true/false}])

minimum_amount decimal(10,4)

transaction_fees_amount (nullable) decimal(10,4)
transaction_fees_type (fixed/percent)

transaction_bonus_amount (nullable)  decimal(10,4)
transaction_bonus_type (fixed/percent)

cashback_allowed (bool)
bonus_allowed (bool)

group

enabled (bool)

created_at
deleted_at
updated_at
---


user_payments
---
id

payment_id (rand 8-12)

user_id
payment_method_code

account
payment_input json([{key: '', val: ''}])

amount

cashback_amount (null)
bonus_amount (null)

status (created, processing, completed, declined)

api_response json()
api_reference_id str
api_status

note
admin_note

paid_at

created_at
updated_at
---


----


total available amount = total confirmed amount (user_offerwall_sales + user_bonuses only confirmed amount) - total withdrawn amount (user_payments with completed & processing, created)


1. chk available amout
2. min amount chk

---

# Stats:

1. total offer completed count
2. total earned (userofferwallsales + userbonuses confirmed), total pending earning (userofferwallsales + userbonuses pending)
3. total paid (user_payments completed), inprogress payments (user_payment processing + created)
4. earning in last 1 day, 1 week, 1 month
```
