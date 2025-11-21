import styles from "./Game.module.css";

function Game() {
  const implementations = [
    {
      id: 1,
      title: "Mock Minesweeper Game",
      description:
        "A fully functional minesweeper implementation with timer, flagging, and win/lose detection. This serves as an example for students.",
      author: "Example Implementation",
      link: "/mock-game",
      difficulty: "Beginner",
      status: "Complete",
    },
    {
      id: 2,
      title: "Basic Minesweeper",
      description: "A simple implementation with basic game mechanics",
      author: "Author Name",
      link: "#",
      difficulty: "Beginner",
      status: "Complete",
    },
    {
      id: 3,
      title: "Advanced Minesweeper",
      description: "Features timer, high scores, and custom difficulty",
      author: "Author name",
      link: "#",
      difficulty: "Intermediate",
      status: "In Progress",
    },
    {
      id: 4,
      title: "Minesweeper with Themes",
      description: "Multiple visual themes and sound effects",
      author: "Author name",
      link: "#",
      difficulty: "Advanced",
      status: "Planning",
    },
    {
      id: 42,
      title: "Minesweeper",
      description:
        "A complete migration of the vanilla JS game to React, using components, hooks, and CSS modules.",
      author: "Maksym Maliutin",
      link: "/maliutin-maksym",
      difficulty: "Intermediate",
      status: "Complete",
    },
    {
      id: 5,
      title: "Minesweeper (React Migration)",
      description:
        "A complete migration of the original JS game to React, using components, hooks, and CSS Modules.",
      author: "Uzenkova Daria",
      link: "/uzenkova-daria",
      difficulty: "Intermediate",
      status: "Complete",
    },
    {
      id: 10,
      title: "Olena Siller - Minesweeper (React Migration)",
      description:
        "A complete migration of the original JS game to React, using components, hooks, and CSS Modules.",
      author: "Olena Siller",
      link: "/siller-olena",
      difficulty: "Intermediate",
      status: "Complete",
    },
    {
      id: 15,
      title: "Minesweeper - Prohvatilov Anton",
      description: "Lab 5 implementation using React and CSS Modules.",
      author: "Prohvatilov Anton",
      link: "/prohvatilov-anton",
      difficulty: "Intermediate",
      status: "In Progress",
    },
    {
      id: 77,
      title: "Minesweeper",
      description:
        "A complete migration of the vanilla JS game to React, using components, hooks, and CSS modules.",
      author: "Buchka Mykyta",
      link: "/buchka-mykyta",
      difficulty: "Intermediate",
      status: "Complete",
    },
    {
      id: 23,
      title: "Minesweeper (React + CSS Modules)",
      description:
        "Компоненти: Board/Cell/Toolbar/Modal. Безпечний перший клік, акорд, рекорди.",
      author: "Malenchuk Maryna",
      link: "/malenchuk-maryna",
      difficulty: "Intermediate",
      status: "Complete",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "#27ae60";
      case "In Progress":
        return "#f39c12";
      case "Planning":
        return "#3498db";
      default:
        return "#95a5a6";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#27ae60";
      case "Intermediate":
        return "#f39c12";
      case "Advanced":
        return "#e74c3c";
      default:
        return "#95a5a6";
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
              <a
                href={impl.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkBtn}
              >
                View Implementation →
              </a>
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

export default Game;
