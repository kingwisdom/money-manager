<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Config;

class EmailVerification extends Notification
{
    use Queueable;

    /**
     * Build the mail representation of the notification.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim(Config::get('app.frontend_url'), '/');
        $hash = sha1($notifiable->email);

        return (new MailMessage)
            ->subject('Verify your email address')
            ->line('Thanks for signing up for Monidrive. Please click the button below to verify your email address.')
            ->action('Verify Email', $frontendUrl.'/verify-email?id='.$notifiable->getKey().'&hash='.$hash)
            ->line('If you did not create an account, no further action is required.');
    }
}
