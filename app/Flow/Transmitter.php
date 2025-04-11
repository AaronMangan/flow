<?php

namespace App\Flow;

class Transmitter
{
    protected $to = [];
    protected $from = '';
    protected $documents = [];
    private $organisation_id;

    /**
     * Constructor function.
     */
    public function __construct()
    {
        // Set the organisation_id by default. Documents and other items can be added from other orgs, only by super admins.
        // But for traceability, it should show that the super admin created the transmittal.
        $organisation_id = \Auth::user()->organisation_id ?? null;
    }

    // GETTERS
    /**
     * Return the organisation id.
     *
     * @return integer|null
     */
    public function getOrganisationId(): ?int
    {
        return $this->organisation_id ?? null;
    }

    public function getTo(): ?array
    {
        return $this->to ?? [];
    }

    public function getFrom(): ?string
    {
        return $this->from;
    }

    public function getDocuments(): ?array
    {
        return $this->documents ?? [];
    }

    // SETTERS
    public function to(array $recipients = []): ?self
    {
        $this->to = $recipients ?? [];
        return $this;
    }

    public function from(string $from = ''): ?self
    {
        $this->from = $from ?? '';
        return $this;
    }

    public function documents(array $documents): ?self
    {
        if (empty($documents) || !isset($documents)) {
            return $this;
        }

        $this->documents = $documents;
        return $this;
    }

    // Methods. If you want these to be chainable, they should return $this.
    public function send(): ?bool
    {
        //
    }

    /**
     * Validates the transmittal. Specifically, it validates that the transmittal is
     * in a position to be sent with all the information it requires.
     *
     * @return boolean|null
     */
    public function validate(): ?bool
    {
        $data = [
            (!isset($this->to) || !is_array($this->to) || count($this->to) <= 0) ? false : true,
            (!isset($this->from) || gettype($this->from) != 'string' || is_null($this->from)) ? false : true,
            (!isset($this->documents) || count($this->documents) <= 0 || !is_array($this->documents)) ? false : true
        ];

        return in_array(false, $data, true) ? false : true;
    }

    /**
     * Returns everything in an array - useful in testing or debugging.
     * Uses get object vars to return all public properties as keys in the array.
     *
     * @return array|null
     */
    public function toArray(): ?array
    {
        return array(get_object_vars($this));
    }
}


/*
    $recipients = [
        'azza.mangan@gmail.com', 'aaron@mangan.dev'
    ];
    $documents = App\Models\Documents::withoutGlobalScope(App\Models\Scopes\OrganisationScope::class)->where('organisation_id', $this->organisation_id)->get();
    $from = 'aaron@mangan.dev';

    $tx = new Transmittal();
    $tx->to($recipients)->from($from)->documents($documents)->send();
*/
