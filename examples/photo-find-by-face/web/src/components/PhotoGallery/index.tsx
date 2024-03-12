/*
 * @Author: renxia
 * @Date: 2024-03-15 09:14:29
 * @LastEditors: renxia
 * @LastEditTime: 2024-03-15 09:36:51
 * @Description:
 */
import { useState, useCallback } from 'react';
import Gallery, { type GalleryProps, type PhotoClickHandler } from 'react-photo-gallery';
import Carousel, { Modal, ModalGateway } from 'react-images';

type PGalleryItem = GalleryProps<{ title?: string }>['photos'][0];

export function PhotoGallery({ photos = [] as PGalleryItem[] }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox: PhotoClickHandler = useCallback((_event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  return (
    <div>
      <Gallery photos={photos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                // src: x.src.replace('thumbnail', 'large'),
                source: x.src.replace('thumbnail', 'large'),
                srcset: x.srcSet,
                caption: x.title,
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
}
