import { useEffect, useState } from 'react';
import Loader from 'components/Loader';
import Searchbar from 'components/Searchbar';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ImageGallery from 'components/ImageGallery';
import { getImages } from 'services/getImages';

import '../styles/styles.css';

const App = params => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreHidden, setIsLoadMoreHidden] = useState(true);
  const imgPerPage = 12;

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    setIsLoading(true);
    setIsLoadMoreHidden(true);

    getImages(searchQuery, currentPage, imgPerPage)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return Promise.reject(
          new Error(`Error! Нет результатов поиска по запросу ${searchQuery}`)
        );
      })
      .then(data => {
        setImages(prevImages => [...prevImages, ...data.hits]);
        setIsLoading(false);

        currentPage === Math.ceil(data.totalHits / imgPerPage)
          ? setIsLoadMoreHidden(true)
          : setIsLoadMoreHidden(false);

        if (data.hits.length === 0) {
          setIsLoadMoreHidden(true);
        }
      })
      .catch(error => {
        setError(error.massege);
      })
      .finally(() => setIsLoading(false));
  }, [searchQuery, currentPage]);

  const handleSearch = newSearchQuery => {
    if (newSearchQuery !== searchQuery) {
      setCurrentPage(1);
      setImages([]);
      setCurrentImage(null);
      setError('');
    }
    setSearchQuery(newSearchQuery);
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const updateСurrentImage = value => {
    setCurrentImage(value);
  };

  const handleLoadMore = () => {
    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSearch} />
      {error && <h1>Упс, что-то пошло не так! 😢 {error.massege}</h1>}

      {images.length > 0 && (
        <ImageGallery
          images={images}
          toggleModal={toggleModal}
          updateСurrentImage={updateСurrentImage}
        />
      )}

      {isLoading && <Loader />}

      {!isLoadMoreHidden && <Button handleLoadMore={handleLoadMore} />}

      {showModal && <Modal onClose={toggleModal} currentImage={currentImage} />}
    </div>
  );
};

export default App;
