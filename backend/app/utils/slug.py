import shortuuid

def generate_slug(length: int = 6) -> str:
    return shortuuid.ShortUUID().random(length=length)
