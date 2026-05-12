import round from '../assets/round.gif'

const SpinnerLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      
      <div className="flex items-center justify-center">
        <img
          src={round}
          alt="Loading..."
          className="loader-gif"
        />
      </div>

    </div>
  )
}

export default SpinnerLoader