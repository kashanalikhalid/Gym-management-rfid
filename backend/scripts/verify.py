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

data=sys.stdin.readlines()
data = ' '.join(map(str, data))
li = list(data.split("*"))

kp1 = ast.literal_eval(str(li[0]))
kp1 = read_json(kp1)
# print("kp1 done")

des1 = list(li[1].split(","))
for i in range(0, len(des1)):
        des1[i] = int(des1[i])
#
array_shape1=ast.literal_eval(li[2])
des1_img = numpy.array(des1).reshape(array_shape1).astype('uint8')

imgdata = base64.b64decode(li[3])
np_data = numpy.fromstring(imgdata,numpy.uint8)
img1 = cv2.imdecode(np_data,cv2.IMREAD_GRAYSCALE)
orb = cv2.ORB_create()
_,des1 = orb.compute(des1_img, kp1)

kp2 = ast.literal_eval(str(li[4]))
kp2 = read_json(kp2)
#
des2 = list(li[5].split(","))
for i in range(0, len(des2)):
        des2[i] = int(des2[i])

array_shape2=ast.literal_eval(li[6])
des2_img = numpy.array(des2).reshape(array_shape2).astype('uint8')

imgdata = base64.b64decode(li[7])
np_data = numpy.fromstring(imgdata,numpy.uint8)
img2 = cv2.imdecode(np_data,cv2.IMREAD_GRAYSCALE)

_,des2 = orb.compute(des2_img, kp2)

bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches = sorted(bf.match(des1, des2), key=lambda match: match.distance)
score = 0
for match in matches:
        score += match.distance
score_threshold = 30
print(score/len(matches))
# if score / len(matches) < score_threshold:
#         print("Fingerprint matches.")
#     else:
#         print("Fingerprint does not match.")
