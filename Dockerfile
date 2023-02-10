FROM openjdk:slim
COPY pricebest/* pricebest/
CMD ["npm", "install"]