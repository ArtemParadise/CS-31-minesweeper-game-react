import styles from './Game.module.css';

export default function Game() {
  const implementations = [
    {
      id: 1,
      title: 'Mock Minesweeper Game',
      description: 'Reference implementation.',
      author: 'Example',
      link: '/mock-game',
      difficulty: 'Beginner',
      status: 'Complete',
    },
    {
      id: 2,
      title: 'Minesweeper (React + CSS Modules)',
      description:
        'Компоненти: Board/Cell/Toolbar/Modal. Безпечний перший клік, акорд, рекорди.',
      author: 'Malenchuk Maryna',
      link: '/malenchuk-maryna',
      difficulty: 'Intermediate',
      status: 'Complete',
    },
    {
      id: 4,
      title: 'Minesweeper with Themes',
      description: 'Multiple visual themes and sound effects',
      author: 'Author name',
      link: '#',
      difficulty: 'Advanced',
      status: 'Planning',
    },
    {
      id: 42,
      title: 'Minesweeper',
      description:
        'A complete migration of the vanilla JS game to React, using components, hooks, and CSS modules.',
      author: 'Maksym Maliutin',
      link: '/maliutin-maksym',
      difficulty: 'Intermediate',
      status: 'Complete',
    },
    {
      id: 5,
      title: 'Minesweeper (React Migration)',
      description:
        'A complete migration of the original JS game to React, using components, hooks, and CSS Modules.',
      author: 'Uzenkova Daria',
      link: '/uzenkova-daria',
      difficulty: 'Intermediate',
      status: 'Complete',
    },
    {
      id: 15,
      title: 'Minesweeper - Prohvatilov Anton',
      description: 'Lab 5 implementation using React and CSS Modules.',
      author: 'Prohvatilov Anton',
      link: '/prohvatilov-anton',
      difficulty: 'Intermediate',
      status: 'In Progress',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return '#27ae60';
      case 'In Progress':
        return '#f39c12';
      case 'Planning':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#27ae60';
      case 'Intermediate':
        return '#f39c12';
      case 'Advanced':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Student Implementations</h1>
        <p>Browse student minesweeper implementations</p>
        <div className={styles.instructions}>
          <p>
            <strong>To add implementations:</strong> Edit the implementations
            array in the code
          </p>
        </div>
      </div>

      <div className={styles.implementationsList}>
        {implementations.map((impl) => (
          <div key={impl.id} className={styles.implementationCard}>
            <div className={styles.cardHeader}>
              <h3>{impl.title}</h3>
              <div className={styles.badges}>
                <span
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(impl.status) }}
                >
                  {impl.status}
                </span>
                <span
                  className={styles.difficultyBadge}
                  style={{
                    backgroundColor: getDifficultyColor(impl.difficulty),
                  }}
                >
                  {impl.difficulty}
                </span>
              </div>
            </div>
            <p className={styles.author}>by {impl.author}</p>
            <p className={styles.description}>{impl.description}</p>
            <div className={styles.cardActions}>
              {impl.link.startsWith('/') ? (
                <a href={impl.link} className={styles.linkBtn}>
                  View Implementation →
                </a>
              ) : (
                <a
                  href={impl.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkBtn}
                >
                  View Implementation →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {implementations.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No implementations yet</h2>
          <p>Add implementations by editing the code</p>
        </div>
      )}
    </div>
  );
}
