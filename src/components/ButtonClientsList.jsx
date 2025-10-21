const ButtonClientsList = ({ text, functionOnClick, imgSource }) => {
  return (
    <div>
      <button onClick={functionOnClick}>
        <img src={imgSource} width={50} height={50} alt={text} />
      </button>
    </div>
  );
};

export default ButtonClientsList;
