import json
import os
import re
import unicodedata

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")

with open(os.path.join(ARTIFACTS_DIR, "rule_config.json"), "r", encoding="utf-8") as f:
    RC = json.load(f)

SUSPICIOUS_TLDS = set(RC["suspicious_tlds"])
ZERO_WIDTH_CHARS = RC["zero_width_chars"]
FRAUD_INTENT_KEYWORDS = RC["fraud_intent_keywords"]
FINANCIAL_TERMS = RC["financial_terms"]
SUSPICIOUS_PHRASES = RC["suspicious_phrases"]

URL_REGEX = re.compile(
    r'((?:https?://|www\.)[^\s,;]+)|'
    r'((?:[A-Za-z0-9\u0400-\u04FF\u0370-\u03FF\-]+\.)+[A-Za-z\u0400-\u04FF\u0370-\u03FF]{2,})'
)

def extract_urls_and_domains(text):
    matches = URL_REGEX.findall(text)
    urls, domains = [], []
    for a, b in matches:
        u = a or b
        urls.append(u)
        d = re.sub(r'^https?://', '', u, flags=re.I)
        d = re.sub(r'^www\.', '', d, flags=re.I)
        d = d.split('/')[0].split('?')[0].split(':')[0]
        d = d.strip(".,; ")
        domains.append(d.lower())
    return urls, domains

def contains_zero_width(text):
    return any(ch in text for ch in ZERO_WIDTH_CHARS)

def contains_punycode(domain):
    return "xn--" in domain.lower()

def domain_has_non_latin(domain):
    for ch in domain:
        if ch.isalpha():
            try:
                name = unicodedata.name(ch)
            except Exception:
                return True
            if "LATIN" not in name:
                return True
    return False

def text_contains_any(text, arr):
    t = text.lower()
    return any(k in t for k in arr)

def rule_engine(text: str):
    low = text.lower()
    urls, domains = extract_urls_and_domains(text)
    has_url = len(urls) > 0

    if contains_zero_width(text):
        return "FRAUD"

    for d in domains:
        if contains_punycode(d):
            return "FRAUD"
        if domain_has_non_latin(d):
            return "FRAUD"

    if has_url and text_contains_any(low, FRAUD_INTENT_KEYWORDS):
        return "FRAUD"

    for d in domains:
        for tld in SUSPICIOUS_TLDS:
            if d.endswith(tld):
                if text_contains_any(low, FINANCIAL_TERMS):
                    return "FRAUD"
                return "SUSPICIOUS"

    if text_contains_any(low, SUSPICIOUS_PHRASES):
        return "SUSPICIOUS"

    return None