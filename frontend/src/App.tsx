import { useState } from 'react';
import { QuiniPage } from './components/QuiniPage';
import { HistoryPage } from './components/history';
import { RulesPage } from './components/rules';
import { ScoringPage } from './components/scoring';
import { RankingPage } from './components/ranking';
import { AuthProvider } from './contexts/AuthContext';

type Page = 'play' | 'history' | 'rules' | 'scoring' | 'ranking';

/**
 * Root application component with simple client-side navigation
 */
function App() {
  const [currentPage, setCurrentPage] = useState<Page>('play');

  const navigateTo = (page: Page) => setCurrentPage(page);

  return (
    <AuthProvider>
      {currentPage === 'play' && (
        <QuiniPage
          onNavigateToHistory={() => navigateTo('history')}
          onNavigateToRules={() => navigateTo('rules')}
          onNavigateToScoring={() => navigateTo('scoring')}
          onNavigateToRanking={() => navigateTo('ranking')}
          currentPage={currentPage}
        />
      )}
      {currentPage === 'history' && (
        <HistoryPage
          onBack={() => navigateTo('play')}
          onNavigateToHistory={() => navigateTo('history')}
          onNavigateToRules={() => navigateTo('rules')}
          onNavigateToScoring={() => navigateTo('scoring')}
          onNavigateToRanking={() => navigateTo('ranking')}
          currentPage={currentPage}
        />
      )}
      {currentPage === 'rules' && (
        <RulesPage
          onBack={() => navigateTo('play')}
          onNavigateToRules={() => navigateTo('rules')}
          onNavigateToScoring={() => navigateTo('scoring')}
          onNavigateToRanking={() => navigateTo('ranking')}
          currentPage={currentPage}
        />
      )}
      {currentPage === 'scoring' && (
        <ScoringPage
          onBack={() => navigateTo('play')}
          onNavigateToRules={() => navigateTo('rules')}
          onNavigateToScoring={() => navigateTo('scoring')}
          onNavigateToRanking={() => navigateTo('ranking')}
          currentPage={currentPage}
        />
      )}
      {currentPage === 'ranking' && (
        <RankingPage
          onBack={() => navigateTo('play')}
          onNavigateToHistory={() => navigateTo('history')}
          onNavigateToRules={() => navigateTo('rules')}
          onNavigateToScoring={() => navigateTo('scoring')}
          onNavigateToRanking={() => navigateTo('ranking')}
          currentPage={currentPage}
        />
      )}
    </AuthProvider>
  );
}

export default App;
