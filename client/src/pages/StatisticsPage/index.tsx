import Header from '../../components/Header';
import Statistics from '../../components/Statistics';

const StatisticsPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full mt-[84px] overflow-y-auto">
        <Statistics />
      </div>
    </div>
  );
};

export default StatisticsPage; 