import { NotificationsModel } from "../models/NotificationsModel.js";
import { BadRequestError } from "../utils/error.js";

export async function createNotification(request, response, next) {
  try {
    const newNotification = await NotificationsModel.create(request.body);

    return response.json({
      success: true,
      data: {
        message: "create notification done.",
        data: {
          id: newNotification.id,
          userId: newNotification.userId,
          title: newNotification.title,
          message: newNotification.message,
          redirectUrl: newNotification.redirectUrl,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationAsRead(request, response, next) {
  if (!request.params?.id) {
    throw new BadRequestError("id not supllied");
  }
  try {
    const notificationId = request.params.id;
    const [updateAsRead] = await NotificationsModel.update(
      {
        isRead: true,
      },
      {
        where: {
          id: notificationId,
        },
      },
    );

    if (updateAsRead === 0) {
      throw Error("internal DB error");
    }

    response.json({
      success: true,
      data: {
        message: "mark as read done",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationAsRead(request, response, next) {
  try {
    const [updateAsRead] = await NotificationsModel.update(
      {
        isRead: true,
      },
      {
        where: {
          userId: request.user.id,
        },
      },
    );

    if (updateAsRead === 0) {
      throw Error("internal DB error");
    }

    response.json({
      success: true,
      data: {
        message: "mark all notification as read done",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function fetchNotifications(request, response, next) {
  try {
    const notifications = await NotificationsModel.findAll({});

    response.json({
      success: true,
      data: {
        message: "fetch notification done",
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function fetchNotificationByUser(request, response, next) {
  try {
    const notifications = await NotificationsModel.findAll({
      where: {
        userId: request.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    response.json({
      success: true,
      data: {
        message: "fetch notification done",
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
}
