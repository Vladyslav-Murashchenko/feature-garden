# Feature Garden Engineering Guide

> This section is in progress

This guide focuses on the practical side of Feature Garden.

It helps you make decisions across the entire lifecycle of a project — from the initial setup to long-term evolution:

- [How do you start a new project?](#how-do-you-start-a-new-project)
- [What libraries should you begin with?](#what-libraries-should-you-begin-with)
- [Where should code live?](#where-should-code-live)
- [When should you create a feature?](#when-should-you-create-a-feature)
- [When should you extract code into libraries?](#when-should-you-extract-code-into-libraries)
- [How do you keep complexity under control as the system grows?](#how-do-you-keep-complexity-under-control-as-the-system-grows)

## How do you start a new project?

To start a new project, follow these steps:

1. Scaffold the project using a framework of your choice.  
   Most frameworks define how routing works and provide a dedicated folder for it — this becomes your **app layer**.

2. Create the following top-level folders:
   - `features`
   - `shared-features`
   - `libs`  
   Add `.gitkeep` files so Git tracks them.

3. Decide which libraries you want to include from the start.  
   See: [What libraries should you begin with?](#what-libraries-should-you-begin-with)  
   Then create corresponding folders inside `libs`.

4. Set up boundary enforcement early.  
   See: [Enforcement Guide](./enforcement-guide.md)

5. *(Optional)* Add a link to Feature Garden in your project’s `README.md`:  
   https://github.com/Vladyslav-Murashchenko/feature-garden

## What libraries should you begin with?

There is no universal answer to this question — it depends on your application, the framework you use, and the surrounding ecosystem.

However, in most cases, three libraries are a good starting point: `domain`, `api`, and `ui`.

### Domain Library

The goal of the domain library is to extract shared domain logic from features, centralize it, and make it reusable across the application.

This does not mean that all domain logic must live in the domain library. It is perfectly fine to keep domain logic inside a feature when it is specific to that feature and is not reused elsewhere.

The main property of the domain is that it is completely unaware of any infrastructure.
The domain should not depend on APIs, databases, or external services.
To achieve this, I prefer to model the domain as an anemic domain model, with all domain logic expressed as pure functions. This keeps the domain fully functional and easy to reason about.

Example:
```
libs/domain/
    ├── model.ts
    └── time-intervals/
        ├── calculateDuration.ts
        ├── calculateDuration.test.ts
        ├── getInitial.ts
        ├── getInitial.test.ts
        ├── sortIntervals.ts
        ├── sortIntervals.test.ts
        ├── validateInterval.ts
        └── validateInterval.test.ts
```

However, this is not a strict requirement. You can also use a rich domain model if that better fits your preferences or constraints.

### API Library

The goal of the API Library is to avoid duplication of API related code across the application.
It provides convenient abstractions for reading and updating data.
The exact form of these abstractions depends on the framework being used, the data fetching and caching strategies, and how much implementation detail you want to hide from features.

For example, an abstraction can hide details about:

- Whether data is retrieved from the backend or from IndexedDB
- Whether data comes from cache or requires a server request
- How cache invalidation is implemented
- Whether Axios or the native Fetch API is used
- Whether the API uses REST or GraphQL

A feature simply consumes the abstraction provided by the API library.

This architecture does not impose strict rules on the API library's internal structure. The exact structure depends on the needs and complexity of your project.

One possible way to organize it could look like this:
```
libs/api/
├── _internal/
│   └── db.ts                     # Private implementation details
├── active-task/
│   ├── completeActiveTask.ts    
│   ├── pauseActiveTask.ts       
│   ├── startTask.ts             
│   └── useActiveTaskState.ts     
├── tasks/
│   ├── createTask.ts             
│   ├── deleteTask.ts             
│   ├── reopenTask.ts             
│   ├── useTask.ts               
│   ├── useTasks.ts               
│   └── updateTaskName.ts        
└── time-intervals/
    ├── createTimeInterval.ts    
    ├── deleteTimeInterval.ts    
    ├── updateTimeInterval.ts   
    ├── useTaskDuration.ts       
    └── useTaskTimeIntervals.ts
```


### UI Library
The goal of the UI library is to provide a reusable abstraction for the application's appearance. 
The idea is that when a feature uses the `Button` component, it should not care about:

- Whether it is built from scratch or uses an external UI library
- How theming is implemented
- Unnecessary accessibility details
- Animation and interaction details
- How consistency with the design system is maintained

The feature simply uses the component provided by the UI library.

Abstractions inside the UI library must not know anything about your domain. For example, having `TaskModal` inside the UI library would be wrong, because the UI library shouldn't know that the app is about tasks.

You may choose not to have an internal UI library at all and use an external one. However, there are strong reasons to introduce an internal UI layer:

- The external libraries API is usually too generic, so in the internal library, you can make it simpler
- At some point, you may decide to switch to a different external UI library. Having an internal abstraction significantly reduces the migration cost

This architecture does not impose strict rules on the UI library's internal structure. The exact structure depends on the needs and complexity of your project.

One possible way to organize it could look like this:
```
libs/ui/
├── modal/
│   ├── ConfirmModal.tsx         # Confirmation dialog with cancel/confirm actions
│   ├── FormModal.tsx            # Modal with form submit functionality
│   └── Modal.tsx                
├── utils/
│   ├── cn.ts                    # ClassName utility
│   ├── formatDuration.ts        # Format milliseconds to "Xh Ym Zs" string
│   ├── showToast.ts             # Display toast notifications
│   └── withErrorToast.ts        # Generic error handling wrapper with toast
├── Button.tsx                    
├── ButtonGroup.tsx            
├── Card.tsx                     
├── DateTimePicker.tsx          
├── FieldError.tsx             
├── Input.tsx               
├── Label.tsx                   
├── Spinner.tsx                
├── TextField.tsx               
└── Toast.tsx                 
```

TODO:
- Migration guide
- Decision guide
  - When to create a feature
  - When to create a nested function
  - When to leave a plain file
  - When to move to libs
  - When is shared-feature allowed
  - When should NOT be shared-feature
  - How do I know that a function has become too big
  - How do I know that a library has become a garbage can
