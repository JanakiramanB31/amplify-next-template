import { get, post, put, del } from 'aws-amplify/api';
export const getItem = async function getItem() {
    try {
      const restOperation = get({ 
        apiName: 'myRestApi',
        path: 'items' 
      });
      const response = await restOperation.response;
      console.log('GET call succeeded: ', response);
    } catch (error) {
      handleError(error);
    }
  }

export const postItem = async function postItem() {
  try {
    const restOperation = post({
      apiName: 'myRestApi',
      path: 'items',
      options: {
        body: {
          message: 'Mow the lawn'
        }
      }
    });

    const { body } = await restOperation.response;
    const response = await body.json();

    console.log('POST call succeeded');
    console.log(response);
  } catch (error) {
    handleError(error);
    // console.log('POST call failed: ', JSON.parse(error.response.body));
  }
}


export const updateItems = async function updateItems() {
  try {
    const Item = { name: 'My first Item', message: 'Hello world!' };
    const restOperation = put({
      apiName: 'myRestApi',
      path: 'items/1',
      options: {
        body: Item
      }
    });
    const response = await restOperation.response;
    console.log('PUT call succeeded: ', response);
  } catch (error) {
    handleError(error)
  }
}

export const deleteItem = async function deleteItem() {
    try {
      const restOperation = del({
        apiName: 'myRestApi',
        path: 'items/1'
      });
      await restOperation.response;
      console.log('DELETE call succeeded');
    } catch (e) {
      handleError(e);
    }
  }

function handleError(error:any) {
    if (error instanceof Error) {
        console.log('GET call failed: ', error.message);
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
        console.log('GET call failed: ', JSON.parse((error as any).response.body));
    } else {
        console.log('GET call failed: ', error);
    }
}