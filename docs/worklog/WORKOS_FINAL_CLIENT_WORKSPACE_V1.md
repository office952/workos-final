# Client Workspace V1

First daily Client Workspace in WorkOS Final.

## Decision

Customer remains the technical identity. The workspace is a read projection of existing Cereri, Oferte and Lucrări keyed by `customerId`. Optional current-profile fields were added. CER-XXXXXXXX is unique at persistence. Comercial groups Cereri, Oferte and Clienți without changing bookmarked URLs.

```text
Clienți → workspace → Cerere / Ofertă / Lucrare
```

Customer rename keeps history. Frozen Quote / Order keep the historical name.

## Evidence

`docs/worklog/screenshots/clients-overview-desktop.png`
`docs/worklog/screenshots/client-workspace-overview.png`
`docs/worklog/screenshots/client-workspace-requests.png`
`docs/worklog/screenshots/client-workspace-quotes.png`
`docs/worklog/screenshots/client-workspace-jobs.png`
`docs/worklog/screenshots/client-workspace-renamed-history.png`
`docs/worklog/screenshots/client-workspace-narrow.png`
`docs/worklog/screenshots/commercial-navigation.png`
