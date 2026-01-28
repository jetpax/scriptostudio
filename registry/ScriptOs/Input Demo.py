"""
ScriptO: Input Demo
====================
Demonstrates the input() function working over WebREPL.
This ScriptO shows interactive user input in MicroPython scripts.
"""

# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 0,    # No interrupt button needed for input demo
    
    info    = dict(
        name        = 'Input Demo',
        version     = [1, 0, 0],
        category    = 'Demos',
        description = '''Interactive input demonstration for WebREPL.\n\
                         This ScriptO demonstrates the input() function working correctly over WebREPL.\n\
                         It shows various input scenarios including:\n\
                         - Basic input with prompts\n\
                         - Input in a loop\n\
                         - Simple number guessing game''',
        author      = 'jetpax',
        mail        = 'jep@alphabetiq.com',
        www         = 'https://github.com/jetpax/scripto-studio'
    ),
    
    args    = dict(
        demo_mode   = dict( label    = 'Select demo mode:',
                           type     = dict,
                           items    = dict( 
                               basic   = "Basic Input Test",
                               loop    = "Input Loop (3 items)",
                               game    = "Number Guessing Game"
                           ),
                           value    = 'basic'
                         ),
        show_type   = dict( label    = 'Show input type info:',
                           type     = bool,
                           value    = True )
    )

)

# === END_CONFIG_PARAMETERS ===


print()
print("=" * 40)
print("  INPUT() DEMO - WebREPL Edition")
print("=" * 40)
print()

# Basic Input Test
if args.demo_mode == 'basic':
    print(">>> Basic Input Test <<<")
    print()
    
    name = input("What is your name? ")
    print(f"Hello, {name}!")
    
    if args.show_type:
        print(f"  (Type: {type(name).__name__}, Length: {len(name)})")
    
    food = input("What is your favorite food? ")
    print(f"Mmm, {food} sounds delicious!")
    
    print()
    print("Basic input test complete!")

# Input Loop
elif args.demo_mode == 'loop':
    print(">>> Input Loop Test <<<")
    print("Enter 3 items for a shopping list:")
    print()
    
    items = []
    for i in range(3):
        item = input(f"  Item {i+1}: ")
        items.append(item)
    
    print()
    print("Your shopping list:")
    for i, item in enumerate(items, 1):
        print(f"  {i}. {item}")
    
    print()
    print("Loop input test complete!")

# Number Guessing Game
elif args.demo_mode == 'game':
    import random
    
    print(">>> Number Guessing Game <<<")
    print("I'm thinking of a number between 1 and 10.")
    print()
    
    secret = random.randint(1, 10)
    attempts = 0
    max_attempts = 3
    
    while attempts < max_attempts:
        guess = input(f"Guess #{attempts + 1}: ")
        attempts += 1
        
        try:
            guess_num = int(guess)
            if guess_num == secret:
                print(f"Correct! You got it in {attempts} attempt(s)!")
                break
            elif guess_num < secret:
                print("Too low!")
            else:
                print("Too high!")
        except ValueError:
            print("Please enter a valid number!")
    else:
        print(f"Out of attempts! The number was {secret}.")
    
    print()
    print("Game complete!")

print()
print("=" * 40)
print("  Demo finished successfully")
print("=" * 40)
