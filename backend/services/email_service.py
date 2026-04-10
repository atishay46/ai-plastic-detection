import random

def send_report(data):
    # Dummy email logic (no real email for now)
    report_id = "PP" + str(random.randint(100000, 999999))

    return {
        "message": "Report sent successfully",
        "report_id": report_id
    }