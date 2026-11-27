
import { useEffect, useState } from 'react'

import type { NFTListParams } from '../types/nft'
import { useNFTs } from '../hooks/useNFTs'

import { Header } from '../../../components/shared/Header'
import { HeroSection } from '../components/HeroSection'
import { CatalogSidebar } from '../components/CatalogSidebar'
import { CatalogToolbar } from '../components/CatalogToolbar'
import { NFTGrid } from '../components/NFTGrid'
import { AuthModal } from '../../account/components/AuthModal'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | undefined>()
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | undefined>()
  const [priceError, setPriceError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [sort, setSort] = useState<NFTListParams['sort']>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] =
    useState<NFTListParams['tab']>('all')

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  const { data, isLoading, isError, refetch } = useNFTs({
    page: currentPage,
    limit: 6,
    sort,
    tab: activeTab,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(appliedMinPrice !== undefined && { minPrice: appliedMinPrice }),
    ...(appliedMaxPrice !== undefined && { maxPrice: appliedMaxPrice }),
  })

  function handleApplyPrice() {
    const min = minPriceInput.trim() === '' ? undefined : Number(minPriceInput)
    const max = maxPriceInput.trim() === '' ? undefined : Number(maxPriceInput)

    if (
      (min !== undefined && (!Number.isFinite(min) || min < 0)) ||
      (max !== undefined && (!Number.isFinite(max) || max < 0))
    ) {
      setPriceError('Informe valores válidos.')
      return
    }

    if (min !== undefined && max !== undefined && min > max) {
      setPriceError('O mínimo não pode superar o máximo.')
      return
    }

    setPriceError('')
    setAppliedMinPrice(min)
    setAppliedMaxPrice(max)
    setCurrentPage(1)
  }

  function handleClearFilters() {
    setSelectedCategory('')
    setMinPriceInput('')
    setMaxPriceInput('')
    setAppliedMinPrice(undefined)
    setAppliedMaxPrice(undefined)
    setSearchInput('')
    setIsSearchOpen(false)
    setSort('newest')
    setPriceError('')
    setCurrentPage(1)
    setActiveTab('all')
  }

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setCurrentPage(1)
  }

  function handleCategoryChange(value: string) {
    setSelectedCategory(value)
    setCurrentPage(1)
  }

  function handleSortChange(value: NFTListParams['sort']) {
    setSort(value)
    setCurrentPage(1)
  }

  const totalPages = data?.totalPages ?? 1

  return (
    <div className="min-h-screen bg-[#100d0b] text-[#eee3d2]">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <Header
          searchValue={searchInput}
          isSearchOpen={isSearchOpen}
          onSearchChange={handleSearchChange}
          onSearchToggle={() => setIsSearchOpen((open) => !open)}
          onLoginClick={() => setIsAuthModalOpen(true)}
        />

        <HeroSection />

        <section
          id="mercado"
          className="grid items-start gap-7 pb-16 lg:grid-cols-[245px_minmax(0,1fr)]"
        >
          <CatalogSidebar
            selectedCategory={selectedCategory}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            priceError={priceError}
            onCategoryChange={handleCategoryChange}
            onMinPriceChange={setMinPriceInput}
            onMaxPriceChange={setMaxPriceInput}
            onApplyPrice={handleApplyPrice}
            onClearFilters={handleClearFilters}
          />

          <div className="min-w-0">
            <CatalogToolbar
              sort={sort}
              tab={activeTab}
              onSortChange={handleSortChange}
              onTabChange={(value) => {
                setActiveTab(value)
                setCurrentPage(1)
              }}
            />

            <NFTGrid
              nfts={data?.items}
              total={data?.total}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
              onClearFilters={handleClearFilters}
            />

            {!isLoading && !isError && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-[#49301f] px-4 py-2 text-sm text-[#d9b98e] transition hover:border-[#e9a45b] hover:text-[#e9a45b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded border text-sm transition ${currentPage === page
                          ? 'border-[#e9a45b] bg-[#e9a45b] text-[#100d0b]'
                          : 'border-[#49301f] text-[#d9b98e] hover:border-[#e9a45b]'
                        }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded border border-[#49301f] px-4 py-2 text-sm text-[#d9b98e] transition hover:border-[#e9a45b] hover:text-[#e9a45b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            )}

            {!isLoading && data && data.total > 0 && (
              <p className="mt-4 text-center text-xs text-[#806d5c]">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        </section>
      </div>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  )
}
