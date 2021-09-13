import useSettings from '../hooks/useSettings';
import { Loader } from './UIComponents';

export default function SellInfo() {
  const settings = useSettings();
  return (
    <div className="ml-auto text-white font-semibold relative flex flex-row items-center">
      {!settings ? (
        <Loader />
      ) : (
        // <span className={`${styles.info} ${isAnimating ? styles.animated : ''}`} onAnimationEnd={handleAnimationEnd}>
        <>
          <div className="mr-2 text-center space-y-2">
            <div className="px-2 text-xs leading-5 font-semibold rounded-full bg-purple-500 text-gray-300">Compra</div>
            <div className="px-2 text-xs leading-5 font-semibold rounded-full bg-purple-500 text-gray-300">Venta</div>
          </div>
          <div>
            100cr x ${settings.creditSellValue * 100} <br />
            100cr x ${settings.creditBuyValue * 100}
          </div>
        </>
      )}
    </div>
  );
}
