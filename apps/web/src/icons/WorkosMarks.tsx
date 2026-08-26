export function JobMark({ title = "Lucrare" }: { title?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden={title ? undefined : true} role="img">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Zm3 2v1.5h10V8.5H7Zm0 4V14h6v-1.5H7Z"
      />
    </svg>
  );
}

export function QuoteMark({ title = "Ofertă" }: { title?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden={title ? undefined : true} role="img">
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm8 1.5V9h4.5L14 4.5ZM8 12h8v1.5H8V12Zm0 3.5h8V17H8v-1.5Z"
      />
    </svg>
  );
}
