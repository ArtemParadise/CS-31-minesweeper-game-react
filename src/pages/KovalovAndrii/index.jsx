import Game from '../../components/KovalovAndrii/Game';

// Добавляем стили для обертки страницы
const pageStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start', 
  paddingTop: '40px', // Немного отступим от хедера
  width: '100%',
  minHeight: '80vh', // Занимаем высоту экрана
};

export default function KovalovAndriiPage() {
  return (
    // Оборачиваем игру в стилизованный div
    <div style={pageStyles}>
      <Game />
    </div>
  );
}