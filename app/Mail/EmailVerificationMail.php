<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $full_name;
    public $link;

    public function __construct($full_name, $link)
    {
        $this->full_name = $full_name;
        $this->link = $link;
    }

    public function build()
    {
        return $this->subject('Verifique seu e-mail')
            ->view('emails.email_verification')
            ->with([
                'full_name' => $this->full_name,
                'link' => $this->link,
            ]);
    }
}
