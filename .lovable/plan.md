# Microsoft Office Integration via Lovable Connectors

Replace the current custom Azure AD client-credentials flow (which is failing with `AADSTS700016`) with Lovable's managed Microsoft connectors. These use a pre-built OAuth gateway — no Azure AD app registration, no client secrets, automatic token refresh.

## Architecture change

**Today**: `teams-meetings-connector` calls `login.microsoftonline.com` directly using `AZURE_AD_CLIENT_ID/TENANT_ID/CLIENT_SECRET` → blocked by the `AADSTS700016` error.

**New**: Edge Functions call `https://connector-gateway.lovable.dev/{microsoft_*}/...` using `LOVABLE_API_KEY` + per-connector `*_API_KEY`. Lovable handles OAuth and token refresh.

```text
Masira Edge Function ──► connector-gateway.lovable.dev ──► Microsoft Graph API
                          (handles OAuth + refresh)
```

**Auth scope note**: Managed connectors authenticate as the *workspace owner's* Microsoft account, not per end-user. This means meetings/emails/files come from one MS 365 account that the connectors are bound to. For each Masira user to see *their own* mailbox/files, per-user OAuth is needed (separate future work).

## Connectors to link (4)

You'll be prompted to authorize each one (one-time OAuth):
1. **Microsoft Teams** — meetings, channels, transcripts
2. **Microsoft Outlook** — email + (calendar via Graph)
3. **Microsoft OneDrive** — file listing, downloads, SharePoint
4. **Microsoft Word / Excel / PowerPoint** — document read/generate (3 separate connectors)

## Edge Functions (new + updated)

| Function | Purpose | Writes to |
|---|---|---|
| `teams-meetings-connector` (rewrite) | Pull joined teams + meetings from Teams via gateway | `meetings_sync` |
| `outlook-mail-connector` (new) | Pull recent emails, surface stakeholder/risk signals | `enterprise_signals` |
| `outlook-calendar-connector` (new) | Sync calendar events as scheduled meetings | `meetings_sync` |
| `onedrive-documents-connector` (new) | List + ingest .docx/.pdf/.xlsx files into Knowledge Base | `documents` |
| `office-report-generator` (new) | Render dashboards/digests as Word/Excel/PowerPoint and upload to OneDrive | OneDrive |

All functions:
- Use the `GATEWAY_URL` pattern with `Authorization: Bearer ${LOVABLE_API_KEY}` + `X-Connection-Api-Key`.
- Validate JWT, validate input with Zod, return CORS headers.
- Log to `integration_sync_logs`.

## UI changes

- **Meeting Hub** (`MeetingHub.tsx`): replace the broken "Sync Teams" button wiring to call the rewritten function; add "Sync Calendar" button.
- **Smart Inbox** (`SmartInbox.tsx`): add "Sync Outlook" action; surface emails as inbox items + push high-signal ones to `enterprise_signals`.
- **Knowledge Base** (`KnowledgeBase.tsx`): add "Import from OneDrive" file picker (lists files via gateway, ingests into `documents`).
- **Reports** (`ReportsView.tsx`): add "Export to Word / Excel / PowerPoint" buttons that call `office-report-generator` and return a OneDrive share link.
- **Integrations page** (`Integrations.tsx`): add a "Microsoft 365" panel showing the 4 connection statuses + last-sync time.

## Data model

No schema changes needed — `meetings_sync`, `documents`, `enterprise_signals`, `integration_configs`, `integration_sync_logs` already cover it. Will add `integration_configs` rows tagged `integration_type = 'microsoft_*'` per connector for sync settings (frequency, last sync).

## Cleanup

- Mark `AZURE_AD_CLIENT_ID / TENANT_ID / CLIENT_SECRET` as unused (keep secrets — non-destructive).
- Remove the OAuth token-fetch block from the old `teams-meetings-connector`.

## Implementation order

1. Link the 4 Microsoft connectors (interactive prompts).
2. Rewrite `teams-meetings-connector` to use the Teams gateway → wire Meeting Hub button → test.
3. Add `outlook-mail-connector` + Smart Inbox sync button.
4. Add `outlook-calendar-connector` + Meeting Hub calendar button.
5. Add `onedrive-documents-connector` + Knowledge Base picker.
6. Add `office-report-generator` + Reports export buttons.
7. Add Microsoft 365 status panel to Integrations page.

## Limitations to call out

- **One MS account, not per-user.** Suitable for an org-wide service-account model. If you later want each Masira user to connect their *own* MS 365, we'll need to register your own Azure AD app and implement per-user OAuth (separate plan).
- Teams meeting **transcripts** require the meeting organizer's tenant to have transcription enabled and recordings stored in OneDrive; gateway returns what Graph exposes.
- File uploads via gateway are limited to ~4MB per request (larger files need chunked upload sessions — can add later).

Approve to proceed and you'll be prompted to authorize each Microsoft connector.