# ARTMO Client Routes & API Contract

| Route | Page | Guard | Main API |
| --- | --- | --- | --- |
| `/` | `HomePage` | none | `POST /api/recommendations` |
| `/result/:id` | `ResultPage` | none | `GET /api/recommendations/:id`, `POST /:id/share` |
| `/artworks` | `GalleryPage` | none | `GET /api/artworks` |
| `/artworks/:id` | `ArtworkDetailPage` | none | `GET /api/artworks/:id`, save (signed in) |
| `/popular` | `PopularPage` | none | `GET /api/artworks/popular` |
| `/login` · `/register` | `LoginPage` · `RegisterPage` | none | Supabase Auth SDK, `GET /api/auth/providers` |
| `/me` | `MyPage` | `ProtectedRoute` | `GET /api/recommendations/me`, profile, saves |
| `/sponsor` | `SponsorPage` | `ProtectedRoute` | `POST /api/sponsorships`, `GET /api/sponsorships/me` |
| `/admin` | `AdminPage` | `AdminRoute` | artworks CRUD, `GET /api/users/all`, `PUT /api/users/:id/type` |
| `/admin/sponsorships` | `AdminSponsorshipsPage` | `AdminRoute` | `GET /api/sponsorships`, approve, reject |

Response shapes
- Artworks, recommendations, sponsorships: `{ data: T }`
- Users, profile, `GET /api/auth/me`: `{ success: true, data: T }`
- Deletes and `POST /api/recommendations/:id/share`: `204`, empty body
- Vague sentence: `200 { data: { needsMoreDetail: true, hint: string } }` → show hint, stay on `/`
- Errors: `400` field message, `401` go to `/login`, `403` "권한이 없습니다", `429` "잠시 후 다시 시도", `5xx` general toast
