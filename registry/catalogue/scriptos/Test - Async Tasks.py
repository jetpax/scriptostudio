
# === START_CONFIG_PARAMETERS ===

dict(

    timeout = 1,
    
    info = dict(
        name        = 'Async Tasks Test',
        version     = [1, 0, 0],
        category    = 'Testing',
        description = 'Tests multiple concurrent async tasks using bg_tasks. Shows interleaved output from tasks A and B.',
        author      = 'ScriptO Studio'
    ),
    
    args = dict(
        
        interval_a = dict( label    = 'Task A interval (seconds):',
                          type     = float,
                          value    = 1 ),
        
        interval_b = dict( label    = 'Task B interval (seconds):',
                          type     = float,
                          value    = 1.4 ),
        
        duration = dict( label    = 'Run duration (seconds, 0=forever):',
                        type     = float,
                        value    = 10.0 )
    
    )

)

# === END_CONFIG_PARAMETERS ===

import asyncio
from lib import bg_tasks

# Counters for each task
count_a = 0
count_b = 0

async def task_a():
    """Task A - prints at interval_a"""
    global count_a
    interval = args.interval_a
    
    while True:
        count_a += 1
        print(f"A: {count_a}")
        await asyncio.sleep(interval)


async def task_b():
    """Task B - prints at interval_b"""
    global count_b
    interval = args.interval_b
    
    while True:
        count_b += 1
        print(f"B: {count_b}")
        await asyncio.sleep(interval)


async def duration_timer():
    """Optional timer to auto-stop after duration"""
    duration = args.duration
    if duration > 0:
        await asyncio.sleep(duration)
        print(f"\nDuration ({duration}s) reached - stopping tasks")
        bg_tasks.stop("task_a")
        bg_tasks.stop("task_b")
        bg_tasks.stop("duration_timer")


# Start the tasks
print("Starting async tasks test...")
print(f"  Task A interval: {args.interval_a}s")
print(f"  Task B interval: {args.interval_b}s")
if args.duration > 0:
    print(f"  Duration: {args.duration}s")
else:
    print("  Duration: forever (use Stop button)")
print("")

bg_tasks.start("task_a", task_a, restart=True)
bg_tasks.start("task_b", task_b, restart=True)

if args.duration > 0:
    bg_tasks.start("duration_timer", duration_timer, restart=True)

print("Tasks started. Press Stop button or run: bg_tasks.stop_user_tasks()")
print("Active tasks:", list(bg_tasks.list_tasks().keys()))
print("")
