

print("You could write MicroPython code before the configuration.")


# === START_CONFIG_PARAMETERS ===

dict(

    info    = dict(
        # ----------------------------------------------------------------------
        name        = 'Script Object template ',                # Name is mandatory
        version     = [1, 0, 0],                                # Version is mandatory
        category    = 'Templates',                              # Optional: category for organization
        description = 'Template for building ScriptOs — MicroPython scripts with '
                      'configurable parameters. Demonstrates all argument types: '
                      'str, int, float, bool, list (GPIO picker), and dict (multiple choice).',
        author      = 'jetpax',                             # Author is mandatory
        mail        = 'jep@alphabetiq.com',                 # Mail is not mandatory
        www         = 'https://scriptostudio.com'           # Web link is not mandatory
        # ----------------------------------------------------------------------
    ),
    
    args    = dict(              # Label and type are mandatory
        # ----------------------------------------------------------------------
        my_first_arg_id    = dict( label    = 'Enter text below:',
                                   type     = str,
                                   value    = "Test..."),  # This default value is not mandatory
        # ----------------------------------------------------------------------
        my_second_arg_id   = dict( label    = 'Enter an integer number below:',
                                   type     = int ),
                                   # You could add a default value (int)
        # ----------------------------------------------------------------------
        my_third_arg_id    = dict( label    = 'Choose a GPIO pin below:',
                                   type     = list,
                                   optional = True ),      # User can choose "No pin"
        # ----------------------------------------------------------------------
        my_fourth_arg_id   = dict( label    = 'Enter a float number below:',
                                   type     = float,
                                   value    = 123.456 ),   # This default value is not mandatory
        # ----------------------------------------------------------------------
        my_fifth_arg_id    = dict( label    = 'Choose a boolean value via the button below:',
                                   type     = bool ),
                                   # You could add a default value (True)
        # ----------------------------------------------------------------------
        my_sixth_arg_id    = dict( label    = 'Choose an option from the list below:',
                                   type     = dict,
                                   items    = dict( option1_id = "Select this first option",
                                                    option2_id = "Select this second option",
                                                    option3_id = "Select this third option" ),
                                   value    = 'option2_id' # This default value is not mandatory
                                 )
        # ----------------------------------------------------------------------
    )

)

# === END_CONFIG_PARAMETERS ===

# ==============================================================================
# How ScriptOs Work
# ==============================================================================
#
# ScriptOs execute at module level — there is no main() or entry point.
# Everything below the config block runs immediately when the script loads.
#
# User-configured values are available via the `args` class. At runtime,
# the config block above is replaced with:
#
#     class args:
#         my_first_arg_id = "Test..."
#         my_second_arg_id = 42
#
# Access them directly:  print(args.my_first_arg_id)
#
# ==============================================================================
# ASYNC CODE IN SCRIPTOS
# ==============================================================================
#
# ⚠️ NEVER use asyncio.run() or loop.run_until_complete() in a ScriptOs!
#    These block the MicroPython main task and prevent queue_pump from
#    processing M2M responses, background tasks, and WebREPL I/O.
#
# ✅ Use bg_tasks.start() instead:
#
#    async def _my_async_work():
#        result = await some_async_function()
#        print(result)
#        # Optionally re-display prompt (output appears after REPL prompt)
#        print('>>> ', end='')
#
#    from lib.sys import bg_tasks
#    bg_tasks.start('my_task', _my_async_work, restart=True)
#    print('Task started...')
#
# KEY POINTS:
# - bg_tasks.start() returns immediately — module-level code continues
# - The async function runs cooperatively in the existing event loop
# - Any output from the async function appears AFTER the REPL prompt
# - Use print('>>> ', end='') at the end of async output to restore prompt
# - For mixed sync/async: run sync tests at module level, async via bg_tasks
#
# ==============================================================================


print("Write your MicroPython code after the configuration section.")


print()
print('* This code is executed on your Scriptomator device *')
print()
print('You have defined these parameters:')
print('  - args.my_first_arg_id   ->  %s' % args.my_first_arg_id)
print('  - args.my_second_arg_id  ->  %s' % args.my_second_arg_id)
print('  - args.my_third_arg_id   ->  %s' % args.my_third_arg_id)
print('  - args.my_fourth_arg_id  ->  %s' % args.my_fourth_arg_id)
print('  - args.my_fifth_arg_id   ->  %s' % args.my_fifth_arg_id)
print('  - args.my_sixth_arg_id   ->  %s' % args.my_sixth_arg_id)
print()
print('You can access all parameters from the "args" class.')
print('It\'s easy!')
print()

import os
print('Example: here are the contents of the root folder:\n%s' % os.listdir())
print('Bye')
