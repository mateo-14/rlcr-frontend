import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { Loader } from './UIComponents';

const SellInfo = () => {
  const settings = useContext(SettingsContext);
  /*   const [isAnimating, setIsAnimating] = useState(true);
  const valuesAreLoaded = useRef();

  useEffect(() => {
    console.log('hola');
    if (!valuesAreLoaded.current && settings?.creditBuyValue && settings?.creditSellValue) {
      valuesAreLoaded.current = {
        creditBuyValue: settings.creditBuyValue,
        creditSellValue: settings.creditSellValue,
      };
    } else if (valuesAreLoaded.current && !isAnimating) {
      setIsAnimating(true);
    }
  }, [settings?.creditBuyValue, settings?.creditSellValue]);

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };
 */
  return (
    <div className="ml-auto text-white font-semibold relative flex flex-row items-center">
      {!settings ? (
        <Loader size={8} />
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
};

export default SellInfo;
