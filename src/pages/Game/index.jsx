import styles from './Game.module.css'

export default function Game() {
  const implementations = [
    {
      id: 1,
      title: "Mock Minesweeper Game",
      description: "Reference implementation.",
      author: "Example",
      link: "/mock-game",
      difficulty: "Beginner",
      status: "Complete"
    },
    {
      id: 2,
      title: "Minesweeper (React + CSS Modules)",
      description: "Компоненти: Board/Cell/Toolbar/Modal. Безпечний перший клік, акорд, рекорди.",
      author: "Malenchuk Maryna",
      link: "/malenchuk-maryna",
      difficulty: "Intermediate",
      status: "Complete"
    }
  ];

  const getStatusColor = (s) => s === 'Complete' ? '#27ae60' : s === 'In Progress' ? '#f39c12' : '#3498db';
  const getDifficultyColor = (d) => d === 'Beginner' ? '#27ae60' : d === 'Intermediate' ? '#f39c12' : '#e74c3c';

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Student Implementations</h1>
        <p>Browse student minesweeper implementations</p>
      </div>

      <div className={styles.implementationsList}>
        {implementations.map((impl) => (
          <div key={impl.id} className={styles.implementationCard}>
            <div className={styles.cardHeader}>
              <h3>{impl.title}</h3>
              <div className={styles.badges}>
                <span className={styles.statusBadge} style={{ backgroundColor: getStatusColor(impl.status) }}>
                  {impl.status}
                </span>
                <span className={styles.difficultyBadge} style={{ backgroundColor: getDifficultyColor(impl.difficulty) }}>
                  {impl.difficulty}
                </span>
              </div>
            </div>
            <p className={styles.author}>by {impl.author}</p>
            <p className={styles.description}>{impl.description}</p>
            <div className={styles.cardActions}>
              <a href={impl.link} className={styles.linkBtn}>View Implementation →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
