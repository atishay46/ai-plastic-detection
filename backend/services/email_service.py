import smtplib
from email.message import EmailMessage
import random
import os


#  City → Email Mapping
city_email_map = {
    "Mumbai": "udapureas@rknec.edu",
    "Pune": "yadava_1@rknec.edu",
    "Nagpur": "jainav_1@rknec.edu",
    "Nashik": "raghuseab@rknec.edu",
    "Thane": "jainav_1@rknec.edu",
    "Aurangabad": "raghuseab@rknec.edu"
}

def send_report(data):
    report_id = "PP" + str(random.randint(100000, 999999))

    city = data.get("city")
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    # Read credentials at call time (after load_dotenv has run in main.py)
    sender_email = os.getenv("SENDER_EMAIL", "")
    app_password = os.getenv("APP_PASSWORD", "")

    if not sender_email or not app_password:
        print("[WARN] Email credentials not set -- skipping email send")
        return {
            "message": f"Report logged for {city} (email not configured)",
            "report_id": report_id
        }

    #  Dynamic receiver based on city
    receiver_email = city_email_map.get(city, sender_email)

    # Build location section if coordinates are provided
    location_section = ""
    if latitude is not None and longitude is not None:
        maps_link = f"https://www.google.com/maps?q={latitude},{longitude}"
        location_section = f"""
Location Details:
- Latitude: {latitude}
- Longitude: {longitude}
- Google Maps Link: {maps_link}
"""

    msg = EmailMessage()
    msg["Subject"] = f"Plastic Pollution Report - {city}"
    msg["From"] = sender_email
    msg["To"] = receiver_email

    msg.set_content(f"""
Subject: Plastic Pollution Report – {city}

Dear Municipal Authority,

I would like to report a case of plastic pollution observed in {city}.

Based on AI analysis, the pollution level has been classified as {(data.get('severity') or 'Unknown').upper()}, 
with a Plastic Pollution Index (PPI) of {data.get('ppi')}.

Details of the report are as follows:
- Report ID: {report_id}
- Location: {city}
<<<<<<< HEAD
- Reported by: {data.get('name')}
- Contact: {data.get('email')} | {data.get('phone')}
{location_section}
=======
- Reported by: {data.get('name', 'Anonymous')}
- Contact: {data.get('email', 'N/A')} | {data.get('phone', 'N/A')}

>>>>>>> 31b1f639dddd52aaeebe5ad55f3bdaceee1cdab4
I request the concerned authority to kindly take necessary action to address this issue at the earliest.

Thank you for your attention.

Sincerely,  
EcoSpectra System
""")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_email, app_password)
            smtp.send_message(msg)

        return {
            "message": f"Report sent to {city} authority",
            "report_id": report_id
        }

    except Exception as e:
        print(f"[ERROR] Email send error: {e}")
        return {
            "message": "Email failed",
            "report_id": report_id,
            "error": str(e)
        }