# Feature Garden Engineering Guide

> This section is in progress

This guide focuses on the practical side of Feature Garden.

It helps you make engineering decisions:

- How to get started on a new project?
- [What libraries to start from?](#what-libraries-to-start-from)
- Where to place code?
- When to create a feature?
- When to extract to libraries?
- How to keep complexity under control as the feature grows?

## What libraries to start from?

The recommended starting set of libraries is `domain`, `api`, and `ui`. 

## Domain Library

The goal of the domain library is to extract domain logic from features, centralize it in one place, and make it reusable across the entire application.

A domain library is not mandatory. Many front-end applications don't need one because most domain logic lives on the backend.

However, some applications — especially offline-first ones — require significant client-side domain logic, and a dedicated domain library can help keep that logic organized and reusable.

This architecture does not impose strict rules on the domain library's internal structure. 
The exact structure depends on the needs and complexity of your project.

One possible way to organize it could look like this:
```
libs/domain/
    ├── active-task/
    │   └── model.ts
    ├── tasks/
    │   └── model.ts
    └── time-intervals/
        ├── calculateDuration.ts
        ├── calculateDuration.test.ts
        ├── getInitial.ts
        ├── getInitial.test.ts
        ├── model.ts
        ├── sortIntervals.ts
        ├── sortIntervals.test.ts
        ├── validateInterval.ts
        └── validateInterval.test.ts
```

## API Library

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
│   ├── model.ts                  # ActiveTaskState type
│   ├── pauseActiveTask.ts       
│   ├── startTask.ts             
│   └── useActiveTaskState.ts     
├── tasks/
│   ├── createTask.ts             
│   ├── deleteTask.ts             
│   ├── model.ts                  # Task type
│   ├── reopenTask.ts             
│   ├── useTask.ts               
│   ├── useTasks.ts               
│   └── updateTaskName.ts        
└── time-intervals/
    ├── createTimeInterval.ts    
    ├── deleteTimeInterval.ts    
    ├── model.ts                  # TimeInterval type
    ├── updateTimeInterval.ts   
    ├── useTaskDuration.ts       
    └── useTaskTimeIntervals.ts
```


## UI Library
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
