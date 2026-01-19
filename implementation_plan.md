# Implementation Plan - Blog Feature Enhancements

## Goal Description
Add missing features to the Admin Blog Creation/Edit form to match frontend capabilities and user requests.
Key features:
1.  **Read Time**: Manual input for read time (e.g., "5 মিনিট").
2.  **Cover Image Upload**: Direct file upload using existing Cloudinary API (`/api/admin/upload`).
3.  **Author Selection**: Dropdown to select author (Admin/Editor override).
4.  **Publish Date**: Backdate/Schedule support with Date Picker.

## User Review Required
None. Internal enhancement requested by user.

## Proposed Changes

### Database & API
#### [NEW] [app/api/admin/users/list/route.ts](file:///e:/Saiful/Programming/Mollik-Vercel/app/api/admin/users/list/route.ts)
- Lightweight API to fetch Admins/Editors/SuperAdmins for the author dropdown.
- Returns: `{ id, name, email, image, role }[]`.

#### [MODIFY] [app/api/admin/blog/route.ts](file:///e:/Saiful/Programming/Mollik-Vercel/app/api/admin/blog/route.ts)
- Update `POST` handler to extract `readTime`, `authorId`, and `publishedAt` from body.
- Validate `authorId` (ensure only admins can set it).

#### [MODIFY] [app/api/admin/blog/[id]/route.ts](file:///e:/Saiful/Programming/Mollik-Vercel/app/api/admin/blog/[id]/route.ts)
- Update `PATCH` handler similarly to support updating these new fields.

### Frontend
#### [MODIFY] [components/admin/BlogForm.tsx](file:///e:/Saiful/Programming/Mollik-Vercel/components/admin/BlogForm.tsx)
- **State**: Add `readTime`, `authorId`, `publishedAt` to state.
- **UI**:
    - Add Input for `readTime`.
    - Add `datetime-local` input for `publishedAt`.
    - Add `<select>` for `authorId` (fetching from new `/list` API).
    - Add **File Upload** component/button next to Cover Image URL input.
        - Logic: Select file -> `POST /api/admin/upload` -> Get URL -> Set to `coverImage` state.

## Verification Plan
### Manual Verification
1.  **Upload**: Upload an image, verify the URL is filled and preview shows up.
2.  **Date**: Set a past date, publish, check if frontend shows that date.
3.  **Author**: Change author to another admin, verify frontend shows new author.
4.  **Read Time**: Set custom read time, verify frontend display.
