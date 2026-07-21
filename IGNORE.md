Spin up subagent(s) to look over your code and the code in the files you touched. Are there any mistakes or problems? Any sloppiness? Any code which could be shorter? Anything which could have a clearer mental model? I'm OK with changing a lot of stuff or nothing at all. After proposing ideas (if any) then look at them with fresh eyes and recommend which we should actually do (don't change anything yet)

Look over all of this again. Tell me about how we could accomplish the same user-facing outcomes, experience and performance. With less lines of code. Make sure what you propose is Convex-native and SvelteKit-appropriate

Create a plan for a fresh agent who has no context. Explain from first principles without any information that's not necessary

# Last commit

(do in xHigh)

Compare this codebase vs last commit. What changes do you disagree with (if any)? Spin up sub-agents to help

# Taste

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 3 places where the code could be written more tastefully

Look for small things that would put off a senior dev. Style issues are fine

Then spin up new agents who inspect the code review what the first agents found with a critical eye

Then you make up your own mind and tell me which ones we should actually do

# Svelte

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 3 places where the code could make better use of sveltekit's advantages

Don't look for big strutural things. Look for syntax and other code-level changes. Style issues are fine. These don't need to be huge wins

Then spin up new agents who inspect the code review what the first agents found with a critical eye

Then you make up your own mind and tell me which ones we should actually do

# Short

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 3 places where the code could be shorter

Don't look for big strutural things. Don't try to create new components unless it's clealy worth it

Look for lines of code that could be written better. These don't need to be huge wins

Then spin up new agents who inspect the code review what the first agents found with a critical eye

Then you make up your own mind and tell me which ones we should actually do

# Bugs

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 1 bug

Then spin up new agents who inspect the code review what the first agents found with a critical eye

Then you make up your own mind and tell me which ones we should actually do
