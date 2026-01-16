# ScriptO Debugger Demo
# This demonstrates the MicroPython debugger in Scripto Studio

import time

# Simple counter with watch expressions
counter = 0
total = 0

print("Starting debugger demo...")

for i in range(5):  # ●
    counter = i
    total += counter
    print(f"Iteration {i}: counter={counter}, total={total}")
    time.sleep(0.1)

# Calculate average
if total > 0:  # ●
    average = total / counter if counter > 0 else 0
    print(f"Average: {average}")

print("Demo complete!")

# Try these watch expressions:
# - counter
# - total
# - counter * 2
# - total / (counter + 1)
