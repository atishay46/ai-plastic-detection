def calculate_ppi(predictions, image_width, image_height):
    """
    Smart Plastic Pollution Index (PPI) Calculation

    Factors used:
    1. Bottle Count
    2. Plastic Coverage Area
    3. Density Factor
    4. Average Detection Confidence
    """

    bottle_count = len(predictions)

    # Prevent division errors
    if image_width == 0 or image_height == 0:
        return {
            "ppi": 0,
            "severity": "Low",
            "coverage_percentage": 0,
            "density_factor": 0,
            "average_confidence": 0,
            "bottle_count": 0
        }

    image_area = image_width * image_height

    total_bottle_area = 0
    total_confidence = 0

    # Calculate total detected plastic area
    for p in predictions:
        width = p.get("width", 0)
        height = p.get("height", 0)

        bottle_area = width * height
        total_bottle_area += bottle_area

        total_confidence += p.get("confidence", 0)

    
    # 1. Coverage Percentage
    
    coverage_percentage = min((total_bottle_area / image_area) * 100, 90)

    
    # 2. Density Factor
        
    # Higher if more waste occupies less area
    density_factor = (
        bottle_count / coverage_percentage
        if coverage_percentage > 0
        else 0
    )

    
    # 3. Average Confidence
    
    avg_confidence = (
        total_confidence / bottle_count
        if bottle_count > 0
        else 0
    )

    confidence_score = avg_confidence * 100

    # 4. Weighted Smart PPI Formula

    ppi = (
        (0.35 * bottle_count) +
        (0.40 * coverage_percentage) +
        (0.15 * density_factor) +
        (0.10 * confidence_score)
    )

    # Normalize PPI
    ppi = round(min(ppi, 100), 2)

    
    # Severity Classification
    
    if ppi < 30:
        severity = "Low"
    elif ppi < 60:
        severity = "Medium"
    else:
        severity = "High"

    return {
        "ppi": ppi,
        "severity": severity,
        "coverage_percentage": round(coverage_percentage, 2),
        "density_factor": round(density_factor, 2),
        "average_confidence": round(avg_confidence, 2),
        "bottle_count": bottle_count
    }