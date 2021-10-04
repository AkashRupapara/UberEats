import React, {useEffect} from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalButton
} from 'baseui/modal';

import { FileUploader } from 'baseui/file-uploader';
import {Row, Col} from 'react-bootstrap'


function UpdateDishModal(props) {


    const { dishModalIsOpen, setDishModalIsOpen, dishes, selectedDishId } = props;

    useEffect(() => {
        if (dishes && selectedDishId) {
            let selectedDish = dishes.filter(
              (dish) => dish.dishId === selectedDishId,
            );
            console.log(selectedDish)
            return;
        }
            // if (selectedDish.length > 0) {
            //   [selectedDish] = selectedDish;
            //   setIsUploading(false);
            //   setName(selectedDish.name);
            //   setDescription(
            //     selectedDish.description ? selectedDish.description : '',
            //   );
            //   setDishPrice(selectedDish.dishPrice ? selectedDish.dishPrice : '');
            //   if (selectedDish.ingreds) {
            //     const ingredientsArr = selectedDish.ingreds.split(',');
            //     const selectedIngreds = ingredientsArr.map((element) => ({
            //       ingredients: element,
            //     }));
            //     const filteredIngreds = selectedIngreds.filter(
            //       (el) =>
            //         // eslint-disable-next-line implicit-arrow-linebreak
            //         el.ingredients !== undefined &&
            //         el.ingredients !== null &&
            //         el.ingredients !== '',
            //     );
            //     setIngredients(filteredIngreds);
            //   }
            //   setCategory(
            //     selectedDish.category ? [{ category: selectedDish.category }] : [],
            //   );
            //   setDishType(
            //     selectedDish.category ? [{ dishType: selectedDish.dishType }] : [],
            //   );
            //   setDishImages(selectedDish.dishImages ? selectedDish.dishImages : []);
            // }
        
    }, [selectedDishId, dishes]);

    console.log(dishModalIsOpen);
  return (
    <div>
      <Modal isOpen={dishModalIsOpen} closeable onClose={() => setDishModalIsOpen(false)}>
        <ModalHeader> Edit Dish Details</ModalHeader>
        <Row>
          <Col>
            <ModalBody>
              <FileUploader
                onDrop={(acceptedFiles) => {
                //   uploadDishImage(acceptedFiles, ele.d_id);
                }}
                // progressMessage={isUploading ? `Uploading... hang tight.` : ''}
              />
            </ModalBody>
            <ModalFooter>
              <ModalButton >Update</ModalButton>
              {/* <ModalButton onClick={dishModalIsOpen[ele.d_id]=false}> Close </ModalButton> */}
            </ModalFooter>
          </Col>
          <Col>Hello</Col>
        </Row>
      </Modal>
    </div>
  );
}

export default UpdateDishModal;
