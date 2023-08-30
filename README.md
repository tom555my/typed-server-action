# Typed Server Action

This is a tiny type-utility wrapper for Next.js's server action. 

## Feature

* Add type and validation to server action function
* Wrapped the return as `Result`

## Installation

The package require `zod` as peer dependency.

```sh
npm/yarn/pnpm install typed-server-action zod
```

## Usage

```typescript

// action.ts
import {
	ServerReturnType,
	serverActionResult,
	typedServerAction,
} from 'typed-server-action';
import { z } from 'zod';

const myServerAction = typedServerAction(z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string()
}), async function(data): Promise<ServerReturnType<User>> {
                // ^ { id: number; firstName: string; lastName: string; }
    const { id, firstName, lastName } = data;
    try {
        const updatedUser = await db.update(users).set({
            firstName,
            lastName
        }).where(eq(users.id, id));
        return serverActionResult.success(updatedUser);
    } catch {
        return serverActionResult.fail([
            {
                key: 'general',
                errMsg: 'The server action failed'
            }
        ]);
    }
});

// page.tsx (use with client component if you like)
'use client';

export default function Page() {
    const _updateUser = async (formData: FormData) => {
        const result = await myServerAction(formData);
            // ^ { success: true, data: T } | { success: false, errMsgs: {key: string; errMsg: string; }[] }
    }

    return (
        ...
    );
}
```
