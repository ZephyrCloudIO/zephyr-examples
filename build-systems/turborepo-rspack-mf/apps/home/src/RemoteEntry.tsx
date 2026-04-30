const styles = {
  wrap: {
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    color: '#fff7ed',
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
    background: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  } as const,
  title: {
    fontSize: '18px',
    fontWeight: 700,
    margin: 0,
    color: '#fff7ed',
  } as const,
  sub: {
    fontSize: '13px',
    color: '#fcd34d',
    opacity: 0.8,
    margin: '0 0 16px 0',
  } as const,
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    background: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
  },
  icon: {
    fontSize: '22px',
  },
  itemTitle: {
    flex: 1,
    fontSize: '14px',
    fontWeight: 600,
  },
  itemPrice: {
    fontSize: '13px',
    color: '#fbbf24',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums' as const,
  },
};

const products = [
  { icon: '📦', name: 'Edge Runtime Bundle', price: '$24.00' },
  { icon: '⚡', name: 'Worker Starter Kit', price: '$12.00' },
  { icon: '🧩', name: 'Component Library', price: '$18.00' },
];

function RemoteEntry() {
  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <span style={styles.badge}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
          Catalog Team
        </span>
      </div>
      <h2 style={styles.title}>Featured Products</h2>
      <p style={styles.sub}>Shipped by turbo_home · independent release cadence</p>
      <div style={styles.list}>
        {products.map((p) => (
          <div key={p.name} style={styles.item}>
            <span style={styles.icon}>{p.icon}</span>
            <span style={styles.itemTitle}>{p.name}</span>
            <span style={styles.itemPrice}>{p.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RemoteEntry;
