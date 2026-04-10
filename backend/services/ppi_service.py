def calculate_ppi(count):
    # Simple formula (you can improve later)
    ppi = count * 5

    if ppi < 20:
        severity = "Low"
    elif ppi < 50:
        severity = "Medium"
    else:
        severity = "High"

    return ppi, severity