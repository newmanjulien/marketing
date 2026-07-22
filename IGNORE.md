Use Opus High

For code review, batch them and say: Do all of these using multiagent workflows

---

# Last commit

Compare this codebase vs last commit. What changes do you disagree with (if any)? Spin up sub-agents and use workflows to help. Are there any mistakes or problems? Any sloppiness? Any code which could be shorter? Anything which could have a clearer mental model? I'm OK with changing a lot of stuff or nothing at all. I'm fine with lots of churn for small gains if they're real gains. After proposing ideas (if any) then look at them with fresh eyes and recommend which we should actually do (don't change anything yet)

# Delete components

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 3 places where there's a component, but it actually should be flattened (there shouldn't be a component). I'm fine with lots of churn for small gains if they're real gains

Then spin up new agents who inspect the code and review what the first agents found with a critical eye

Then you make up your own mind and decide which ones we should actually do

Then spin up subagent(s) to apply the changes

# Svelte

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 3 places where the code could make better use of sveltekit's advantages. I'm fine with lots of churn for small gains if they're real gains

Don't look for big strutural things. Look for syntax and other code-level changes. Style issues are fine. These don't need to be huge wins

Then spin up new agents who inspect the code and review what the first agents found with a critical eye

Then you make up your own mind and decide which ones we should actually do

Then spin up subagent(s) to apply the changes

# Bugs

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 1 bug

Then spin up new agents who inspect the code and review what the first agents found with a critical eye

Then you make up your own mind and decide which ones we should actually do

Then spin up subagent(s) to apply the changes

# Taste

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 3 places where the code could be written more tastefully. I'm fine with lots of churn for small gains if they're real gains

Look for small things that would put off a senior dev. Style issues are fine

Then spin up new agents who inspect the code and review what the first agents found with a critical eye

Then you make up your own mind and decide which ones we should actually do

Then spin up subagent(s) to apply the changes

# Short

Spin up 5 subagents who pick random sections of the code. Get each one to find up to 3 places where the code could be shorter. I'm fine with lots of churn for small gains if they're real gains

Don't look for big strutural things. Don't try to create new components unless it's clealy worth it

Look for lines of code that could be written better. These don't need to be huge wins

Then spin up new agents who inspect the code and review what the first agents found with a critical eye

Then you make up your own mind and decide which ones we should actually do

Then spin up subagent(s) to apply the changes
