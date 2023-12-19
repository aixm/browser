<?php

namespace App\Traits;

trait Paginatable
{
    /**
     * @var int
     */
    private $pageSizeLimit = 100;

    public function getPerPage(): int
    {
        $p = intval(request('per_page'));
        if (!is_numeric(request('per_page')) || ($p <= 0)) {
            return $this->perPage;
        }
        return min($p, $this->pageSizeLimit);
    }
}
