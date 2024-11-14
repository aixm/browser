<?php

namespace App\Enums;

enum ParseStatus: string
{
    case UPLOADED = 'Uploaded';
    case VALIDATING = 'Validating';
    case PARSING = 'Parsing';
    case OK = 'Ok';
    case ERROR = 'Error';
    case DELETING = 'Deleting';
}
