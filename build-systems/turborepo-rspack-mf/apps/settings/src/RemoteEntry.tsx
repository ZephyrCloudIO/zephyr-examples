const styles = {
  wrap: {
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    color: '#ede9fe',
  } as const,
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  } as const,
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '999px',
    background: 'rgba(139, 92, 246, 0.15)',
    color: '#c4b5fd',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  } as const,
  title: {
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
    color: '#ede9fe',
  } as const,
  sub: {
    fontSize: '13px',
    color: '#c4b5fd',
    opacity: 0.8,
    margin: '0 0 16px 0',
  } as const,
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    background: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
  } as const,
  body: {
    flex: 1,
    fontSize: '13px',
    lineHeight: 1.45,
  },
  user: {
    fontWeight: 600,
    color: '#f5f3ff',
  },
  action: {
    color: '#c4b5fd',
    opacity: 0.8,
  },
  time: {
    fontSize: '11px',
    color: '#a78bfa',
    opacity: 0.7,
  },
};

const activity = [
  { initials: 'SW', user: 'Shane', action: 'merged PR #142 into main', time: '2m ago' },
  { initials: 'AF', user: 'Arthur', action: 'deployed host to staging', time: '18m ago' },
  { initials: 'NL', user: 'Nestor', action: 'requested review on #138', time: '1h ago' },
];

function RemoteEntry() {
  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.badge}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c4b5fd', display: 'inline-block' }} />
          Activity Team
        </span>
      </div>
      <h2 style={styles.title}>Team Activity</h2>
      <p style={styles.sub}>Shipped by turbo_settings · independent release cadence</p>
      <div style={styles.list}>
        {activity.map((a) => (
          <div key={a.user} style={styles.item}>
            <div style={styles.avatar}>{a.initials}</div>
            <div style={styles.body}>
              <span style={styles.user}>{a.user}</span>{' '}
              <span style={styles.action}>{a.action}</span>
              <div style={styles.time}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RemoteEntry;
