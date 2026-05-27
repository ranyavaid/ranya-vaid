import styles from './ContactSection.module.css'

type ContactItem = {
  id: string
  icon: string
  iconHover: string
  label: string
  value: string
  href: string
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 'email',
    icon: '/mail.svg',
    iconHover: '/mail-blue.svg',
    label: 'Email',
    value: 'ranyavaid@gmail.com',
    href: 'mailto:ranyavaid@gmail.com',
  },
  {
    id: 'linkedin',
    icon: '/linkedin.svg',
    iconHover: '/linkedin-blue.svg',
    label: 'LinkedIn',
    value: '/in/ranyavaid',
    href: 'https://www.linkedin.com/in/ranya-vaid-185a8a211/',
  },
]

/**
 * ContactSection
 * Contact links.
 */
export function ContactSection() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <header className={styles.header}>
        <h2 id="contact-heading" className={styles.heading}>
          Connect With Me 
        </h2>
        <p className={`body-1 ${styles.subtext}`}>
          Feel free to contact me through any of the links below
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.cards}>
          {CONTACT_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={styles.card}
              target={item.id === 'linkedin' ? '_blank' : undefined}
              rel={item.id === 'linkedin' ? 'noreferrer' : undefined}
            >
              <div className={styles.cardLeft}>
                <span className={styles.iconStack} aria-hidden="true">
                  <img
                    src={item.icon}
                    alt=""
                    className={`${styles.icon} ${styles.iconDefault}`}
                    width={32}
                    height={32}
                    draggable={false}
                  />
                  <img
                    src={item.iconHover}
                    alt=""
                    className={`${styles.icon} ${styles.iconHover}`}
                    width={32}
                    height={32}
                    draggable={false}
                  />
                </span>
                <span className={`h3 ${styles.label}`}>{item.label}</span>
              </div>
              <span className={`body-1 ${styles.value}`}>{item.value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
