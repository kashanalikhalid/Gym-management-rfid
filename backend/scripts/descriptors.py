import cv2
import os
import sys
import numpy
from skimage.morphology import skeletonize, thin
import json
import ast
from enhance import image_enhance
import base64




def removedot(invertThin):
    temp0 = numpy.array(invertThin[:])
    temp0 = numpy.array(temp0)
    temp1 = temp0 / 255
    temp2 = numpy.array(temp1)
    temp3 = numpy.array(temp2)

    enhanced_img = numpy.array(temp0)
    filter0 = numpy.zeros((10, 10))
    W, H = temp0.shape[:2]
    filtersize = 6

    for i in range(W - filtersize):
        for j in range(H - filtersize):
            filter0 = temp1[i:i + filtersize, j:j + filtersize]

            flag = 0
            if sum(filter0[:, 0]) == 0:
                flag += 1
            if sum(filter0[:, filtersize - 1]) == 0:
                flag += 1
            if sum(filter0[0, :]) == 0:
                flag += 1
            if sum(filter0[filtersize - 1, :]) == 0:
                flag += 1
            if flag > 3:
                temp2[i:i + filtersize, j:j + filtersize] = numpy.zeros((filtersize, filtersize))

    return temp2


def save_json(arr):
    data = {}
    cnt = 0
    for i in arr:
        data['KeyPoint_%d'%cnt] = []
        data['KeyPoint_%d'%cnt].append({'x': i.pt[0]})
        data['KeyPoint_%d'%cnt].append({'y': i.pt[1]})
        data['KeyPoint_%d'%cnt].append({'size': i.size})
        cnt+=1
    return data



def read_json(data):
    result = []
    cnt = 0
    while(data.__contains__('KeyPoint_%d'%cnt)):
        pt = cv2.KeyPoint(x=data['KeyPoint_%d'%cnt][0]['x'],y=data['KeyPoint_%d'%cnt][1]['y'], size=data['KeyPoint_%d'%cnt][2]['size'])
        result.append(pt)
        cnt+=1

    return result


def get_descriptors(img):
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    img = clahe.apply(img)
    img = image_enhance.image_enhance(img)
    img = numpy.array(img, dtype=numpy.uint8)
    # Threshold
    ret, img = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
    # Normalize to 0 and 1 range
    img[img == 255] = 1

    # Thinning
    skeleton = skeletonize(img)
    skeleton = numpy.array(skeleton, dtype=numpy.uint8)
    skeleton = removedot(skeleton)
    # Harris corners
    harris_corners = cv2.cornerHarris(img, 3, 3, 0.04)
    harris_normalized = cv2.normalize(harris_corners, 0, 255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32FC1)
    threshold_harris = 125
    # Extract keypoints
    keypoints = []
    for x in range(0, harris_normalized.shape[0]):
        for y in range(0, harris_normalized.shape[1]):
            if harris_normalized[x][y] > threshold_harris:
                keypoints.append(cv2.KeyPoint(y, x, 1))
    # Define descriptor
    orb = cv2.ORB_create()
    # Compute descriptors
    _, des = orb.compute(img, keypoints)
    return (keypoints, img)

img=sys.stdin.readlines()
# imgstr = ' '.join(map(str, img))
# imgdata = base64.b64decode(imgstr)
# np_data = numpy.fromstring(imgdata,numpy.uint8)
# img = cv2.imdecode(np_data,cv2.IMREAD_GRAYSCALE)
# kp1, des1 = get_descriptors(img)
# kp1_str = str(save_json(kp1))
# li2 = [y for x in des1 for y in x]
# li2 = ','.join(map(str, li2))
# coma='*'
# stringg=kp1_str+coma+li2+coma+str(des1.shape)
# print(stringg)
print(img)
