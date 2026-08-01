from PIL import Image, ImageFilter

def remove_background():
    # Load original logo image
    img = Image.open('public/images/logo-anonym-empire.jpg').convert('RGBA')
    datas = img.getdata()

    new_data = []
    for item in datas:
        r, g, b, a = item
        # Calculate brightness / distance from pure white (255, 255, 255)
        # If pixel is close to white background, make it transparent
        if r > 235 and g > 235 and b > 235:
            # Smooth alpha fade based on closeness to white
            diff = (r + g + b) / 3.0
            alpha = int(max(0, (255 - diff) * 10))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))

    img.putdata(new_data)
    
    # Save transparent PNG logo to both public and src assets
    img.save('public/images/logo-anonym-empire-transparent.png', 'PNG')
    img.save('src/assets/images/logo-anonym-empire-transparent.png', 'PNG')
    print("Transparent logo successfully created!")

if __name__ == '__main__':
    remove_background()
