import smtplib
from email.message import EmailMessage
import random
import os
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
APP_PASSWORD = os.getenv("APP_PASSWORD")

#  City → Email Mapping
city_email_map = {
    "Mumbai": "udapureas@rknec.edu",
    "Pune": "yadavas_1@rknec.edu",
    "Nagpur": "jainav_1@rknec.edu",
    "Nashik": "raghuseab@rknec.edu",
    "Thane": "jainav_1@rknec.edu",
    "Aurangabad": "raghuseab@rknec.edu"
}

def send_report(data):
    report_id = "PP" + str(random.randint(100000, 999999))

    city = data.get("city")

    #  Dynamic receiver based on city
    receiver_email = city_email_map.get(city, SENDER_EMAIL)

    msg = EmailMessage()
    msg["Subject"] = f"Plastic Pollution Report - {city}"
    msg["From"] = SENDER_EMAIL
    msg["To"] = receiver_email

    msg.set_content(f"""
Subject: Plastic Pollution Report – {city}

Dear Municipal Authority,

I would like to report a case of plastic pollution observed in {city}.

Based on AI analysis, the pollution level has been classified as {data.get('severity').upper()}, 
with a Plastic Pollution Index (PPI) of {data.get('ppi')}.

Details of the report are as follows:
- Report ID: {report_id}
- Location: {city}
- Reported by: {data.get('name')}
- Contact: {data.get('email')} | {data.get('phone')}

I request the concerned authority to kindly take necessary action to address this issue at the earliest.

Thank you for your attention.

Sincerely,  
EcoSpectra System
""")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(SENDER_EMAIL, APP_PASSWORD)
            smtp.send_message(msg)

        return {
            "message": f"Report sent to {city} authority",
            "report_id": report_id
        }

    except Exception as e:
        return {
            "message": "Email failed",
            "error": str(e)
        }