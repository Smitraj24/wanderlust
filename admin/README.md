# Wanderlust Admin Panel

The admin panel is available at **`/admin`** for users with `isAdmin: true`.

## Making a user an admin

Existing users have `isAdmin: false` by default. To make someone an admin, set the flag in MongoDB:

```js
// In MongoDB shell or Compass:
db.users.updateOne(
  { username: "your-username" },
  { $set: { isAdmin: true } }
)
```

After that, the user will see an **Admin** link in the navbar and can access `/admin`.

## Admin features

- **Dashboard** – Counts for listings, reviews, users; recent listings and reviews.
- **Listings** – View all, search, create, edit, delete any listing (no owner check).
- **Reviews** – View all reviews with author and listing; delete any review.
- **Users** – View all users; delete non-admin users (cannot delete yourself or other admins).
