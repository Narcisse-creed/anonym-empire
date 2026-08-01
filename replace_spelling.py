import os

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('Anonyme Empire', 'Anonym Empire')
    new_content = new_content.replace('ANONYME EMPIRE', 'ANONYM EMPIRE')
    new_content = new_content.replace('anonyme_empire', 'anonym_empire')
    new_content = new_content.replace('Anonyme', 'Anonym')
    new_content = new_content.replace('ANONYME', 'ANONYM')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

def main():
    src_dir = 'src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.json', '.html')):
                filepath = os.path.join(root, file)
                replace_in_file(filepath)

if __name__ == '__main__':
    main()
