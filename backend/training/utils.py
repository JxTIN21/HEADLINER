def calculate_token_f1(reference, prediction):
    """Calculate token-level F1 score between reference and prediction"""
    ref_tokens = reference.lower().split()
    pred_tokens = prediction.lower().split()
    
    common = set(ref_tokens) & set(pred_tokens)
    
    if not common:
        return 0.0
    
    precision = len(common) / len(pred_tokens) if pred_tokens else 0
    recall = len(common) / len(ref_tokens) if ref_tokens else 0
    
    if precision + recall == 0:
        return 0.0
    
    f1 = 2 * (precision * recall) / (precision + recall)
    return f1